import React, { ChangeEvent, useState } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
  closeForm: () => void;
  activity: Activity | undefined;
  editOrCreateActivity: (activity: Activity) => void;
}

export default function ActivityForm({
  closeForm,
  activity: selectedActivity,
  editOrCreateActivity,
}: Props) {
  const InitialState = selectedActivity ?? {
    id: "",
    title: "",
    category: "",
    description: "",
    city: "",
    date: "",
  };

  const [activity, setActivity] = useState(InitialState);

  function handleSubmit() {
    editOrCreateActivity(activity);
  }
  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  }

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Input
          placeholder="Title"
          value={activity.title}
          name="title"
          onChange={handleInputChange}
        />
        <Form.TextArea
          placeholder="Description"
          value={activity.description}
          name="description"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Category"
          value={activity.category}
          name="category"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Date"
          value={activity.date}
          name="date"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="City"
          value={activity.city}
          name="city"
          onChange={handleInputChange}
        />
        <Button floated="right" positive type="submit" content="Submit" />
        <Button
          onClick={closeForm}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
}
