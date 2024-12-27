import type { Decorator } from '@storybook/react'
import { Directorr } from '@nimel/directorr'
import { DirectorrProvider } from '@nimel/directorr-react'

export function createDecoratorWithDirectorr(dirOptions: ConstructorParameters<typeof Directorr>[number]): Decorator {
  const directorr = new Directorr(dirOptions)
  return (Story, context) => (
    <DirectorrProvider value={directorr}>
      <Story {...context} />
    </DirectorrProvider>
  )
}