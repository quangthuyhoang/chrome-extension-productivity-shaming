import Subject from './Subject';

class State extends Subject {

  state: any;

  constructor() {
    super();
    this.state = {};
  }

  update(data = {}) {
    this.state = Object.assign(this.state, data);
    this.notify(this.state)
  }

  // get the state
  get() {
    return this.state;
  }
}

export default State;