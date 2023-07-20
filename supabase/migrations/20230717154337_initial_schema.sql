create table "public"."categories" (
    "uuid" uuid not null default gen_random_uuid(),
    "name" character varying(255) not null,
    "slug" character varying(255) not null
);

ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;
CREATE POLICY view_categories_policy ON "public"."categories" FOR SELECT
  USING (true);


create table "public"."projects" (
    "uuid" uuid not null default gen_random_uuid(),
    "title" character varying(255) not null,
    "excerpt" text not null,
    "description" text not null,
    "image" character varying(255) not null,
    "categoryUuid" uuid not null,
    "pledged" numeric not null default 0,
    "backers" integer not null default 0,
    "funded" character varying(255) not null default '0',
    "softCap" character varying(255) not null,
    "hardCap" character varying(255) not null,
    "startsAt" timestamp without time zone not null,
    "finishesAt" timestamp without time zone not null,
    "createdAt" timestamp without time zone not null default now(),
    "lastUpdatedAt" timestamp without time zone not null default now()
);

ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;
CREATE POLICY view_projects_policy ON "public"."projects" FOR SELECT
  USING (true);

CREATE POLICY "create_project_policy"
ON "public"."projects"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (uuid);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (uuid);

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."projects" add constraint "projects_categoryUuid_fkey" FOREIGN KEY ("categoryUuid") REFERENCES categories(uuid) not valid;

alter table "public"."projects" validate constraint "projects_categoryUuid_fkey";

CREATE POLICY "logged in users can upload project images 1iiiika_0" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'projects');