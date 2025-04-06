import { useMemo } from 'react'

type Friend = {
  friendId: string
  friendName: string
  chatId: string | null
  avatarUrl: string
}

type Friends = Friend[]

type GroupedFriends = Record<string, Friend[]>

export function useGroupedFriends(friends: Friends) {
  return useMemo(() => {
    const grouped: GroupedFriends = friends.reduce((acc, friend) => {
      const initial = friend.friendName.charAt(0).toUpperCase()

      if (!acc[initial]) {
        acc[initial] = []
      }

      acc[initial].push(friend)
      return acc
    }, {} as GroupedFriends)

    Object.keys(grouped).forEach((letter) => {
      if (grouped[letter]) {
        grouped[letter].sort((a, b) => a.friendName.localeCompare(b.friendName))
      }
    })

    return grouped
  }, [friends])
}
