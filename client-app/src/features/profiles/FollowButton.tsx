import { Button, Reveal } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Profile } from "../../app/models/profile";
import { SyntheticEvent } from "react";
interface Props {
  profile: Profile;
}
export default function FollowButton({ profile }: Props) {
  const { userStore, profileStore } = useStore();
  const { updateFollowing, loading } = profileStore;

  function handleFollow(e: SyntheticEvent, userName: string) {
    e.preventDefault();
    profile.following
      ? updateFollowing(userName, false)
      : updateFollowing(userName, true);
  }

  if (userStore.user?.userName === profile.userName) return null;

  return (
    <Reveal animated="move">
      <Reveal.Content visible style={{ width: "100%" }}>
        <Button
          fluid
          color="teal"
          content={profile.following ? "Following" : "Not Following"}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: "100%" }}>
        <Button
          fluid
          basic
          color={profile.following ? "red" : "green"}
          content={profile.following ? "Unfollow" : "Follow"}
          loading={loading}
          onClick={(e) => handleFollow(e, profile.userName)}
        />
      </Reveal.Content>
    </Reveal>
  );
}
