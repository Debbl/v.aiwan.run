import logoGithub from '@iconify/icons-carbon/logo-github'
import { Icon } from '@iconify/react'

function Footer() {
  return (
    <div className='py-3'>
      <a
        href='https://github.com/Debbl/v.aiwan.run'
        target='_blank'
        rel='noreferrer'
      >
        <Icon icon={logoGithub} />
      </a>
    </div>
  )
}
export default Footer
