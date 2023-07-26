(namespace (read-msg "ns"))

(module crowdfund GOVERNANCE

  ; --------------------------------------------------------------------------
  ; Schemas and Tables

  ;define projects schema
  (defschema projects
    projectId:string
    title:string
    token:module{fungible-v2}
    hardCap:decimal
    softCap:decimal
    raised:decimal
    startDate:time
    endDate:time
    status:integer
    project-owner:string
    project-owner-guard:guard
  )

  ;define funds schema
  (defschema funds
    projectId:string
    fundOwner:string
    status:integer
    amount:decimal
    timestamp:time
  )

  (deftable projects-table:{projects})
  (deftable funds-table:{funds})


  ; --------------------------------------------------------------------------
  ; Constants

  ; Statusses
  (defconst CREATED 0)
  (defconst CANCELLED 1)
  (defconst SUCCEEDED 2)
  (defconst FAILED 3)


  ; --------------------------------------------------------------------------
  ; Utils

  (defun vault-guard:guard (projectId: string) (create-capability-guard (VAULT_GUARD projectId)))

  (defun vault-account:string (projectId:string)
    (create-principal (create-capability-guard (VAULT_GUARD projectId)))
  )

  (defun get-fund-key:string (projectId:string account:string) (format "{}-{}" [projectId account]))

  (defun curr-time:time ()
    @doc "Returns current chain's block-time in time type"
    (at 'block-time (chain-data)))


  ;  ; --------------------------------------------------------------------------
  ;  ; Capabilities

  (defcap GOVERNANCE ()
    @doc " Give the admin full access to call and upgrade the module."
    (enforce-keyset "free.crowdfund-admin")
  )

  (defcap ACCT_GUARD (account:string projectId:string)
    (with-read projects-table projectId {
        "token":=token:module{fungible-v2}
      }
      (enforce-guard (at 'guard (token::details account)))
    )
  )

  (defcap PROJECT_OPEN:bool (projectId:string)
    (with-read projects-table projectId {
      "startDate":=startDate,
      "endDate":=endDate,
      "status":=status
      }

      (enforce (= status CREATED) "PROJECT HAS EITHER BEEN CANCELLED OR COMPLETED")
      (enforce (< (curr-time) endDate) "PROJECT HAS ENDED")
      (enforce (>= (curr-time) startDate) "PROJECT HAS NOT YET STARTED")
    )
  )

  (defcap REFUND (projectId from:string)
    @doc "Capability that validates if an investment can be refunded"
    (with-read projects-table projectId {
      "startDate":=startDate,
      "status":= status,
      "token":= token:module{fungible-v2}
      }
      (let ((funder-guard (at 'guard (token::details from))
      ))
        (enforce-guard funder-guard)
        (enforce (>= (curr-time) startDate) "PROJECT HAS NOT STARTED")
        (enforce (!= status SUCCEEDED) "PROJECT HAS ALREADY SUCCEEDED")
      )
    )
  )

  (defcap CANCEL:bool (projectId:string)
    @doc "Capability that validates if a project can be cancelled"
    (with-read projects-table projectId {
      "status":=status,
      "startDate":=startDate
      }
      (enforce (!= status CANCELLED) "NOT CANCELLED")
      (enforce (< (curr-time) startDate) "PROJECT HAS ALREADY STARTED, CANNOT CANCEL")
    )
  )

  (defcap SUCCESS:bool (projectId)
    @doc "Capability that validates if a project can be marked as a success"
    (with-read projects-table projectId{
      "softCap":=softCap,
      "hardCap":=hardCap,
      "raised":=raised,
      "endDate":=endDate,
      "status":=status
      }

      (enforce (or (>= (curr-time) endDate) (>= raised hardCap)) "PROJECT HAS NOT ENDED OR HARDCAP NOT MET")
      (enforce (>= raised softCap) "PROJECT HAS NOT RAISED ENOUGH")
      (enforce (!= status CANCELLED) "PROJECT HAS BEEN CANCELLED")
    )
  )

  (defcap FAIL:bool (projectId)
    @doc "Capability that validates if a project can be marked as a failure"
    (with-read projects-table projectId{
      "softCap":=softCap,
      "endDate":=endDate,
      "raised":=raised,
      "status":=status
      }
      (enforce (!= status CANCELLED) "PROJECT HAS BEEN CANCELLED")
      (enforce (>= (curr-time) endDate) "PROJECT HAS NOT ENDED")
      (enforce (< raised softCap) "PROJECT HAS SUCCEEDED"))
  )

  (defcap PROJECT_OWNER:bool (projectId)
    @doc "Capability that validates if the user is the owner of the project"
    (with-read projects-table projectId {
      "project-owner-guard":=project-owner-guard
      }
      (enforce-guard project-owner-guard))
  )

  (defcap VAULT_GUARD:bool (project-id:string) true)

  (defcap DECREASE_RAISE () true)
  (defcap INCREASE_RAISE () true)

  ; --------------------------------------------------------------------------
  ; Project configuration functions

  (defun create-project (
    projectId:string
    title:string
    token:module{fungible-v2}
    hardCap:decimal
    softCap:decimal
    startDate:time
    endDate:time
    project-owner:string
    project-owner-guard:guard)
    "Adds a project to projects table"
    (enforce (< (curr-time) startDate) "Start Date shouldn't be in the past")
    (enforce (< startDate endDate) "Start Date should be before end date")
    (enforce (< 0.0 hardCap) "Hard cap is not a positive number")
    (enforce (< 0.0 softCap) "Soft cap is not a positive number")
    (enforce (< softCap hardCap) "Hardcap should be higher than softcap")

    (insert projects-table projectId {
        "projectId":projectId,
        "title":title,
        "hardCap":hardCap,
        "softCap":softCap,
        "token":token,
        "raised": 0.0,
        "startDate":startDate,
        "endDate": endDate,
        "status": CREATED,
        "project-owner": project-owner,
        "project-owner-guard": project-owner-guard
        })
  )

  (defun cancel-project (projectId)
    (with-capability (PROJECT_OWNER projectId)
      (with-capability (CANCEL projectId)
        (update projects-table projectId {
          "status": CANCELLED
        })))
  )

  (defun succeed-project (projectId)
    (with-capability (PROJECT_OWNER projectId)
      (with-capability (SUCCESS projectId)
        (update projects-table projectId {
            "status": SUCCEEDED
        })
        (with-read projects-table projectId {
          "raised":= raised,
          "token":= token:module{fungible-v2},
          "project-owner":= project-owner,
          "project-owner-guard":= project-owner-guard
          }

          (with-capability (VAULT_GUARD projectId)
            (install-capability (token::TRANSFER (vault-account projectId) project-owner raised))
            (token::transfer-create (vault-account projectId) project-owner project-owner-guard raised)
          )
        )
      )
    )
  )

  (defun fail-project (projectId)
    (with-capability (PROJECT_OWNER projectId)
      (with-capability (FAIL projectId)
        (update projects-table projectId {
            "status": FAILED
        })))
  )

  ; --------------------------------------------------------------------------
  ; Fundraising functions

  (defun create-fund (projectId funder amount)
    (require-capability (INCREASE_RAISE))
      (with-default-read funds-table (get-fund-key projectId funder)
        {
          "amount": 0.0
        }
        {
          "amount":= fundedAmount
        }
        (write funds-table (get-fund-key projectId funder) {
          "projectId":projectId,
          "fundOwner":funder,
          "amount":(+ amount fundedAmount),
          "timestamp":(curr-time),
          "status":CREATED
          }))
  )

  (defun cancel-fund (projectId funder)
    (require-capability (DECREASE_RAISE))
    (update funds-table (get-fund-key projectId funder) {
      "status":CANCELLED,
      "amount": 0.0
      }))

  (defun increase-project-raise (projectId amount)
    (require-capability (INCREASE_RAISE))
    (with-read projects-table projectId {
      "raised":= raised
      }
      (update projects-table projectId {
        "raised": (+ raised amount)
        }))
  )

  (defun decrease-project-raise (projectId amount)
    (require-capability (DECREASE_RAISE))
    (with-read projects-table projectId {
      "raised":= raised
      }
      (update projects-table projectId {
        "raised": (- raised amount)
        }
      )
    )
  )

  (defun fund-project (projectId funder amount)
    (with-capability (INCREASE_RAISE)
      (with-read projects-table projectId {
        "raised":= raised,
        "hardCap":= hardCap,
        "token":= token:module{fungible-v2}
        }
        (with-capability (PROJECT_OPEN projectId)
          (with-capability (ACCT_GUARD funder projectId)
            (let*
              (
                (remainingProjectCap (- hardCap raised))
                (fundAmount (if (< amount remainingProjectCap) amount remainingProjectCap))
              )

              (enforce (< raised hardCap) "HARDCAP REACHED")
              (enforce (> fundAmount 0.0) "Zero investment amount")

              (token::transfer-create funder (vault-account projectId) (vault-guard projectId) fundAmount)
              (create-fund projectId funder fundAmount)
              (increase-project-raise projectId fundAmount)
            )
          )))))

  (defun rollback-fund-project (projectId funder)
    (with-capability (DECREASE_RAISE)
      (with-capability (REFUND projectId funder)
        (with-read projects-table projectId {
          "token":= token:module{fungible-v2}
          }
          (with-capability (ACCT_GUARD funder projectId)
            (with-read funds-table (get-fund-key projectId funder) {
              "amount":= amount,
              "status":= status
              }
              (enforce (= status CREATED) "NO ACTIVE FUNDS")

              (cancel-fund projectId funder)
              (decrease-project-raise projectId amount)

                (with-capability (VAULT_GUARD projectId)
                  (install-capability (token::TRANSFER (vault-account projectId) funder amount))
                  (token::transfer (vault-account projectId) funder amount)
                )
              )
            )
  ))))

  ; --------------------------------------------------------------------------
  ; State functions

  (defun fetch-user-fundings:list (account:string)
    (map (fetch-funded-amount account) (keys projects-table))
  )

  (defun fetch-funded-amount (projectId:string fundOwner:string)
    (with-default-read funds-table (get-fund-key projectId fundOwner)
      {
        "amount": 0.0
      }
      {
        "amount":= fundedAmount
      }
      { "fundedAmount": fundedAmount, "projectId": projectId }
    )
  )

  (defun read-project (projectId)
    (read projects-table projectId)
  )

  (defun read-projects:list ()
    "Read all projects in projects table"
    (select projects-table
      ['projectId 'title 'hardCap 'softCap 'token 'raised 'startDate 'endDate 'status]
      (constantly true)
    )
  )
)


; --------------------------------------------------------------------------
; Deployment

(if (read-msg "upgrade")
  []
  [
    (define-keyset "free.crowdfund-admin" (read-keyset "admin-keyset"))
    (create-table projects-table)
    (create-table funds-table)
  ]
)
