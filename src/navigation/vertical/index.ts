// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigationData = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'tabler:smart-home',
      path: '/dashboards'
    },
    {
      title: 'Leads',
      icon: 'mdi:leads',
      path: '/leads'
    },
    {
      title: 'Pipeline',
      icon: 'fluent:pipeline-20-regular',
      path: '/pipeline'
    },
    {
      title: 'Tareas',
      icon: 'material-symbols:task-outline',
      path: '/tasks'
    },
    {
      title: 'Configuración',
      icon: 'tabler:settings',
      children: [
        {
          title: 'Roles',
          icon: 'tabler:shield-lock',
          path: '/settings/roles',
        },
        {
          title: 'Usuarios',
          icon: 'tabler:users',
          path: '/settings/users',
        }
      ]
    }
  ]
}

const navigation = (): VerticalNavItemsType => {
  return navigationData()
}

export default navigation
