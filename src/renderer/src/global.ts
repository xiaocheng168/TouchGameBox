import { ElectronAPI } from '@electron-toolkit/preload'
import { LoadingBarApiInjection } from 'naive-ui/es/loading-bar/src/LoadingBarProvider'
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider'

declare global {
    interface Window {
        electron: ElectronAPI
        api: unknown,
        loadBar: LoadingBarApiInjection,
        message: MessageApiInjection,
        notific: NotificationApiInjection
    }
}
