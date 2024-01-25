import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { getErrorMessage } from '../handlers'

export function useMutationWithFeedback({ queryClient, mutationKey, mutationFn, callbackFn, affectedQueryKey, options = {} }) {
  const mutation = useMutation({
    mutationKey: mutationKey,
    mutationFn: mutationFn,
    ...options,
    onMutate: async (variables) => {
      // Show a loading toast message
      const loadingToast = toast.loading('Processando...')

      // Invalidate relevant queries before the mutation
      await queryClient.cancelQueries({ queryKey: affectedQueryKey })

      // Return the loading toast to be used for rollback on error
      return { loadingToast }
    },
    onSuccess: (data, variables, context) => {
      // Dismiss the loading toast and show a success toast
      const { loadingToast } = context
      toast.dismiss(loadingToast)
      const msg = typeof data == 'string' ? data : 'Atualização feita com sucesso !'
      toast.success(msg)
      if (callbackFn) callbackFn()
    },
    onSettled: async (data, error) => {
      await queryClient.invalidateQueries({ queryKey: affectedQueryKey })
    },
    onError: (error, variables, context) => {
      // Rollback changes if needed
      if (context?.loadingToast) {
        toast.dismiss(context.loadingToast)
      }
      const msg = getErrorMessage(error)
      // Show an error toast
      toast.error(msg)
    },
  })

  return mutation
}
