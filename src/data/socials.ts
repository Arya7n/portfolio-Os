export interface SocialLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

export const socials: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Arya7n",
    external: true,
  },
];

export const githubProfile = {
  username: "Arya7n",
  url: "https://github.com/Arya7n",
  avatar: "https://avatars.githubusercontent.com/u/160327550?v=4",
  bio: "Full Stack Dev | Loves clean code",
  publicRepos: 23,
  followers: 3,
};
