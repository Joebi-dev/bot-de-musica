export interface Settings {
    channelVoice: string
    channelText: string
    position: number
}

interface user {
    name: string
    iconURL: string
}

export interface Track{
    user: user
    type: "stream" | "youtube"
    author: string
    title: string
    duration: string
    url: string
    thumb: string
}

export interface PanelUpdate{
    track: Track
    position: number
    list: string[]
}


export interface events {
    name: string
    once: boolean
    execute(...args: any[]): void
}

export enum EnumPlayer{
    next,
    pause,
    radio,
    prev,
    quit
}
