import { useEffect } from 'react'
import { useRouter } from 'next/router'

const TaskView = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/tasks')
  }, [router])

  return null
}

export default TaskView
