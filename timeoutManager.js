class TimersManager {
  constructor() {
      this.timers = [];
      this.logs = [];
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

  _log(element) {
    let log = this.createLog(element);
    this.logs.push(log);

    //if error is not exit, then it is allowed to create timeout
    return log.error !== undefined;
  }

  createLog(element) {
    let res = {};

    res['name'] = element.timer.name;
    res['in'] = element.in;
    try {
      res['out'] = element.timer.job(...element.in);
    } catch (error) {
      res['out'] = undefined;
      res['error'] = {name: error.name, message: error.message, stack: error.stack};
    }
    res['created'] = new Date();

    return res;
  }

  print() {
    console.log(this.logs);
  }

  createTimeout(element) {
    const loggedWithError = this._log(element);

    if (loggedWithError) {
      return;
    }

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

    this.mainTimeout();
  }

  mainTimeout() {
    let biggestDelay = 0;

    this.timers.forEach(element => {
      if (biggestDelay < element.timer.delay) {
        biggestDelay = element.timer.delay;
      }
    });

    setTimeout(() => {
      manager.kill();
    }, 10000 + biggestDelay);
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

  kill() {
    this.stop();
    this.timers = [];
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

const t0 = {
  name:     't0',
  delay:    2000,
  interval: true,
  job:      () => { console.log('t0') }
};

const t1 = {
    name:     't1',
    delay:    1000,
    interval: false,
    job:      (a, b) => a + b
};

const t2 = {
    name:     't2',
    delay:    4000,
    interval: false,
    job:      () => {throw new Error('We have a problem!')}
};

const t3 = {
    name:     't3',
delay: 1000, interval: false, job: n => n
};

manager.add(t0)
manager.add(t1, 1, 2) // 3
manager.add(t2); // undefined
manager.add(t3, 1); // 1

manager.start();
