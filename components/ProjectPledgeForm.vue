<script setup lang="ts">
import { useKdaUsd } from '#imports'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

const emit = defineEmits<{
	(e: 'funded'): void
}>()
const { fund } = await usePact()
const props = defineProps<{
	projectId: string;
}>()

const validationSchema = toTypedSchema(
	zod.object({
		amount: zod.number()
	})
)



const errors = reactive<Record<string, string | null>>({
	amount: null
})
const form = reactive({
	amount: 10
})

const convertedAmount = computed(() => {
	const { asUsd } = useKdaUsd(`${form.amount}`, 'kda')
	return Number(asUsd.value)?.toFixed(2)
})

const submitForm = async () => {
	if (!form.amount) return
	const { requestKey } = await fund({
		id: props.projectId,
		amount: form.amount.toString()
	})
	
	if (requestKey) {
		// send pledge amount to blockchain
		useAlerts().success('This is your transaction key: ' + requestKey, {
			title: 'Thanks for pledging!',
			dismissiable: true,
			timeout: 60000
		})
	}
	
	emit('funded')
}
</script>
<template>
	<Form @submit="submitForm" :validation-schema="validationSchema">
		<label>
			<div class="relative">
				<FormField
					label="How much would you like to pledge?"
					name="amount"
					class="block w-full p-2 pl-12 mb-2 border rounded flex flex-col items-center justify-start"
					type="number"
					v-model.number="form.amount"
				/>
				<span
					class="absolute bottom-[10px] h-[38px] left-[2px] w-10 text-xs bg-primary flex content-center items-center justify-center text-slate-900 font-bold"
				>
	        $KDA
        </span>
			</div>
			<div class="w-full text-left text-primary mb-2">
				$USD {{  convertedAmount }}
			</div>
			<button type="submit" class="btn btn-primary">Pledge Now</button>
		</label>
	</Form>
</template>
