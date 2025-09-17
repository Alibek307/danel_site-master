import { useOs } from '@mantine/hooks';

type ShortcutProps = {
  shortcut: string;
};

export function Shortcut({ shortcut }: ShortcutProps) {
  const os = useOs();

  if (os === 'android' || os === 'ios') return;

  const isMacOs = os === 'macos';

  const formattedShortcut = shortcut
    .replace(/cmd|⌘/gi, isMacOs ? '⌘' : 'Ctrl')
    .replace(/alt|⌥/gi, isMacOs ? '⌥' : 'Alt')
    .replace(/shift|⇧/gi, isMacOs ? '⇧' : 'Shift')
    .replace(/\+/g, isMacOs ? '' : '+');

  return <span>{formattedShortcut}</span>;
}
