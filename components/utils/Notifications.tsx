import { getNovuSubscriberId, NOVU_APPLICATION_IDENTIFIER } from '@/utils/services/novu/config'
import { Inbox } from '@novu/nextjs'
import { dark } from '@novu/react/themes'
import { useTheme } from 'next-themes'
import type { ReactAppearance } from '@novu/react/dist/esm/utils/types'
import type { TAuthSession } from '@/lib/authentication/types'

function Notifications({ session }: { session: TAuthSession }) {
  const { resolvedTheme } = useTheme()

  const appearance: ReactAppearance = {
    baseTheme: resolvedTheme === 'dark' ? dark : undefined,
    variables: {
      fontSize: '14px',
      borderRadius: '8px',
      colorPrimary: 'hsl(var(--primary))',
      colorPrimaryForeground: 'hsl(var(--primary-foreground))',
      colorBackground: 'hsl(var(--background))',
      colorForeground: 'hsl(var(--foreground))',
      colorSecondary: 'hsl(var(--secondary))',
      colorSecondaryForeground: 'hsl(var(--secondary-foreground))',
      colorNeutral: 'hsl(var(--border))',
      colorShadow: 'hsl(var(--shadow))',
      colorRing: 'hsl(var(--ring))',
    },
    elements: {
      inbox__popoverContent: 'w-80 h-112',
      bellIcon: 'text-primary',
      bellContainer: 'hover:bg-accent hover:text-accent-foreground',
    },
  }
  return (
    <Inbox
      applicationIdentifier={NOVU_APPLICATION_IDENTIFIER}
      subscriber={getNovuSubscriberId(session.user.id)}
      localization={{
        'inbox.filters.dropdownOptions.unread': 'Não lidas',
        'inbox.filters.dropdownOptions.default': 'Lidas e não lidas',
        'inbox.filters.dropdownOptions.archived': 'Arquivadas',

        'inbox.filters.labels.unread': 'Não lidas',
        'inbox.filters.labels.default': 'Lidas e não lidas',
        'inbox.filters.labels.archived': 'Arquivadas',

        'notifications.emptyNotice': 'Não há notificações.',
        'notifications.actions.readAll': 'Marcar todas como lidas',
        'notifications.actions.archiveAll': 'Arquivar todas',
        'notifications.actions.archiveRead': 'Arquivar lidas',
        'notifications.newNotifications': ({ notificationCount }: { notificationCount: number }) =>
          `${notificationCount > 99 ? '99+' : notificationCount} new ${notificationCount === 1 ? 'notification' : 'notifications'}`,

        // Individual notification actions
        'notification.actions.read.tooltip': 'Marcar como lida',
        'notification.actions.unread.tooltip': 'Marcar como não lida',
        'notification.actions.archive.tooltip': 'Arquivar',
        'notification.actions.unarchive.tooltip': 'Desarquivar',

        // Preferences section
        'preferences.title': 'Preferências',
        'preferences.emptyNotice': 'Não há preferências específicas para esta notificação.',
        'preferences.global': 'Preferências globais',
        'preferences.workflow.disabled.notice':
          'Contate o administrador para habilitar a gerenciamento de assinaturas para esta notificação crítica.',
        'preferences.workflow.disabled.tooltip': 'Contate o administrador para editar',

        locale: 'pt-BR',
      }}
      appearance={appearance}
    />
  )
}
export default Notifications
