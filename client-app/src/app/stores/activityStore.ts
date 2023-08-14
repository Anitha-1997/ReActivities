import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";

export default class ActivityStore {
  mapRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = true;
  constructor() {
    makeAutoObservable(this);
  }
  get activitiesByDate() {
    return Array.from(this.mapRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }
  loadActivities = async () => {
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((item) => {
          item.date = item.date.split("T")[0];
          this.mapRegistry.set(item.id, item);
        });
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);

      this.setLoadingInitial(false);
    }
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  selectActivity = (id: string) => {
    this.selectedActivity = this.mapRegistry.get(id);
  };
  cancelSelectActivity = () => {
    this.selectedActivity = undefined;
  };
  openForm = (id?: string) => {
    id ? this.selectActivity(id) : this.cancelSelectActivity();
    this.setEditMode(true);
  };
  closeForm = () => {
    this.setEditMode(false);
  };

  setEditMode = (state: boolean) => {
    this.editMode = state;
  };

  createActivity = async (activity: Activity) => {
    this.setLoading(true);
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.mapRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.setEditMode(false);
        this.setLoading(false);
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  };

  editActivity = async (activity: Activity) => {
    this.setLoading(true);
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.mapRegistry.set(activity.id, activity);

        this.selectedActivity = activity;
        this.setEditMode(false);
        this.setLoading(false);
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  };

  deleteActivity = async (id: string) => {
    this.setLoading(true);
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        if (this.selectedActivity?.id === id) {
          this.cancelSelectActivity();
        }
        this.mapRegistry.delete(id);
        this.setLoading(false);
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  };

  setLoading = (state: boolean) => {
    this.loading = state;
  };
}
