import { Text, TextProps } from 'evergreen-ui'

export const SmallText = (props: Exclude<TextProps, 'size'>) => (
  <Text {...props} size={300} />
)

export const LargeText = (props: Exclude<TextProps, 'size'>) => (
  <Text {...props} size={500} />
)

export const MutedText = (props: Exclude<TextProps, 'color'>) => (
  <Text {...props} color="muted" />
)
