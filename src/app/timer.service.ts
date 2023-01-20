import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, Subject, Subscription, takeUntil, timer} from "rxjs";
import {StopWatch} from "./StopWatch.intarface";

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  countStart = 0;
  interval = 0;
  timer$ = new BehaviorSubject(this.countStart);
  stoppedTime = this.countStart;
  running: boolean = false;
  subTimer = new Subscription();

  constructor() {
  }

  toNum(num: number): string {
    return `${num < 10 ? '0' + num : num}`;
  }

  stopWatch(): Observable<StopWatch> {
    return this.timer$
      .pipe(
        map((mlseconds: number): StopWatch => this.secondsToStopWatch(mlseconds))
      );
  }

  start() {
    if (!this.running) {
      this.subTimer = timer(0, 100)
        .pipe(
          map((val) => val + this.stoppedTime)
        ).subscribe(this.timer$);
      this.running = true;
    }
  }

  reset() {
    this.subTimer.unsubscribe();
    this.stoppedTime = this.countStart;
    this.timer$.next(this.countStart);
    this.running = false;
  }

  stop() {
    this.stoppedTime = this.timer$.value;
    this.subTimer.unsubscribe();
    this.running = false;
  }

  secondsToStopWatch(ms: number): StopWatch {
    let rest = ms % 10;
    if (ms % 10 === 0) {
      this.interval = Math.floor(ms / 10);
    }
    const seconds = this.interval % 60;
    const minutes = Math.floor(rest / 600)

    return {
      minutes: this.toNum(minutes),
      seconds: this.toNum(seconds)
    }
  }

}
