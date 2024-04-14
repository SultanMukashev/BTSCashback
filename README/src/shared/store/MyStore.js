import { makeAutoObservable } from "mobx";

class MyStore {
  data = {};

  constructor() {
    makeAutoObservable(this);
  }

  updateData(data) {
    this.data = data;
  
  }
}

const myStore = new MyStore();

export {myStore};