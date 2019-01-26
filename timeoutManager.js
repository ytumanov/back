class TimersManager {
  constructor() {
      this.timers = [];
      this.started;
  }

  checkName(name) {
    if (name === ''|| name === undefined || typeof(name) !== 'string') {
      throw new Error('Not valid timer name provided');
    }
  }

  checkDelay(delay) {
    if (delay === undefined || typeof(delay) !== 'number') {
      throw new Error('Not valid timer delay provided');
    }

    if (delay < 0 || delay > 5000) {
      throw new Error('Not valid timer delay range provided');
    }
  }

  checkInterval(interval) {
    if (interval === undefined || typeof(interval) !== 'boolean') {
      throw new Error('Not valid timer interval provided');
    }
  }

  checkJob(job) {
    if (job === undefined || typeof(job) !== 'function') {
      throw new Error('Not valid timer job provided');
    }
  }

  validate(timer) {
    this.checkName(timer.name);
    this.checkDelay(timer.delay);
    this.checkInterval(timer.interval);
    this.checkJob(timer.job);

    this.timers.forEach(element => {
      if (element.timer.name === timer.name) {
        throw new Error('Timer name is in use');
      }
    });

    if (this.started) {
      throw new Error('Timers already started');
    }
  }

  createTimeout(element) {
    let instance;
    if (element.timer.interval) {
      instance = setInterval(
        element.timer.job,
        element.timer.delay,
        ...element.in);
    } else {
      instance = setTimeout(
        element.timer.job,
        element.timer.delay,
        ...element.in);
    }

    return instance;
  }

  clear(element) {
    if (element.timer.interval) {
      clearInterval(element.timerInstance);
    } else {
      clearTimeout(element.timerInstance);
    }
  }


  add(timer, ...params) {
    this.validate(timer);

    this.timers.push({timer, timerInstance: undefined, in: params});
    return this;
  }

  start() {
    this.timers.forEach(element => {
      element.timerInstance = this.createTimeout(element);
    });
    this.started = true;

  }

  pause(name) {
    this.checkName(name);
    this.timers.forEach(element => {
      if (element.timerInstance && element.timer.name === name) {
        this.clear(element);
        element.timerInstance = undefined;
      }
    });
  }

  remove(name) {
    this.checkName(name);
    this.timers.forEach(element => {
      if (element.timer.name === name) {
        this.clear(element);
        this.timers.pop(element);
      }
    });
  }

  stop() {
    this.timers.forEach(element => {
      if (element.timerInstance) {
        this.clear(element);
        element.timerInstance = undefined;
      }
    });
    this.started = undefined;
  }

  resume(name) {
    this.checkName(name);
    this.timers.forEach(element => {
      if (!element.timerInstance && element.timer.name === name) {
        element.timerInstance = this.createTimeout(element);
      }
    });
  }

}


const manager = new TimersManager();

const t1 = {
  name:     't1',
  delay:    1000,
  interval: true,
  job:      () => { console.log('t1') }
};

const t2 = {
  name:     't2',
  delay:    1000,
  interval: false,
  job:      (a, b) => console.log(a + b)
};


manager.add(t1);
manager.add(t2, 1, 2);
manager.start();
manager.stop();
// manager.resume('t2');
//manager.stop();

//manager.remove('t1');
