// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigationData = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'tabler:smart-home',
      path: '/dashboards'
    }
  ]
}

const navigation = (): VerticalNavItemsType => {
  return navigationData()
}

export default navigation
