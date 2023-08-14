import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingIndicator from "../../../app/layout/LoadingIndicator";

interface Props {}

export default function ActivityDetails({}: Props) {
  const { activityStore } = useStore();
  const {
    selectedActivity: activity,
    cancelSelectActivity,
    openForm,
  } = activityStore;

  if (!activity) return <LoadingIndicator />;
  return (
    <Card>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{activity.date}</span>
        </Card.Meta>
        <Card.Description>{activity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            onClick={() => openForm(activity.id)}
            basic
            color="blue"
            content="Edit"
          ></Button>
          <Button
            onClick={cancelSelectActivity}
            basic
            color="grey"
            content="Cancel"
          ></Button>
        </Button.Group>
      </Card.Content>
    </Card>
  );
}
