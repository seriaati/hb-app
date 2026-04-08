export function buildDiscordUrls(
  channelId: string | number,
  guildId: string | number | null,
): { deepLink: string; webUrl: string } {
  const target = guildId ?? '@me'
  return {
    deepLink: `discord://-/channels/${target}/${channelId}`,
    webUrl: `https://discord.com/channels/${target}/${channelId}`,
  }
}
