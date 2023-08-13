import React, { useEffect, useState } from "react";
import { Button, Container } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { Activity } from "../models/activity";
import Navbar from "./Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import LoadingIndicator from "./LoadingIndicator";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { activityStore } = useStore();

  useEffect(() => {
    agent.Activities.list().then((response) => {
      let activities: Activity[] = [];
      response.forEach((item) => {
        item.date = item.date.split("T")[0];
        activities.push(item);
      });
      setActivities(activities);
      setLoading(false);
    });
  }, []);

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find((activity) => activity.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleEditOrCreateActivity(activity: Activity) {
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() =>
        setActivities([
          ...activities.filter((item) => item.id !== activity.id),
          activity,
        ])
      );
      setSelectedActivity(activity);
      setEditMode(false);
      setSubmitting(false);
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      });
    }
  }

  function handleDelete(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities(activities.filter((item) => item.id !== id));
      setSubmitting(false);
    });
  }
  if (loading) return <LoadingIndicator />;

  return (
    <>
      <Navbar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7em" }}>
        <h2>{activityStore.title}</h2>
        <Button
          content="Add exclamation!"
          positive
          onClick={activityStore.setTitle}
        />
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          editMode={editMode}
          editOrCreateActivity={handleEditOrCreateActivity}
          deleteActivity={handleDelete}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default observer(App);
