import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {fromEvent, Subscription, take, tap, timer} from "rxjs";
import {TimerService} from "./timer.service";
import {StopWatch} from "./StopWatch.intarface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  runningBtn = false;
  subscription = new Subscription();
  dblClickButtonSub = new Subscription();
  stopwatch: StopWatch;
  @ViewChild('dbClick') dbClick: ElementRef;

  constructor(private timerService: TimerService) {
    this.subscription.add(
      this.timerService.stopWatch().subscribe(
        (val: StopWatch) => (this.stopwatch = val)
      )
    );
  }

  work() {
    if (!this.runningBtn) {
      this.start()
    } else {
      this.stop()
    }
  }

  start() {
    this.runningBtn = !this.runningBtn;
    this.timerService.start();
  }

  wait() {
    if (this.runningBtn) {
      this.timerService.stop();
      this.runningBtn = !this.runningBtn;
    }
  }

  stop() {
    this.timerService.reset();
    this.runningBtn = false;
  }

  reset() {
    this.timerService.reset();
    this.runningBtn = true;
    this.timerService.start();

  }

  doubleClickChecker() {
    let clicked = 0;
    this.dblClickButtonSub =
      fromEvent(this.dbClick.nativeElement, 'click').pipe(take(2), tap(v => {
        const time = new Date().getTime();
        if (time < (clicked + 500)) this.wait();
        clicked = time;
      })).subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dblClickButtonSub.unsubscribe();
  }

}


/*
Variant without RxJS

ss: any = "0" + 0;
mm: any = "0" + 0

countStart: any;
running: boolean = false;

start() {
  this.running = true;
  this.countStart = setInterval(() => {
    this.ss++;
    this.ss = this.ss < 10 ? '0' + this.ss : this.ss;

    if (this.ss === 60) {
      this.mm++;
      this.mm = this.mm < 10 ? '0' + this.mm : this.mm;
      this.ss = '0' + 0;
    }
  }, 1000)
}

stop() {
  clearInterval(this.countStart);
  this.running = false;
  this.ss = this.mm = '0' + 0;
}

work() {
  if (!this.running) {
    this.start();
  } else {
    this.stop();
  }
}

reset() {
  clearInterval(this.countStart);
  this.ss = this.mm = '0' + 0;
  this.start();
}
wait() {
  clearInterval(this.countStart);
  this.running = false;
}*/
