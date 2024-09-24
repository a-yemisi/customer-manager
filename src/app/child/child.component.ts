import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChildService } from '../services/child.service';
import { Subscription } from 'rxjs';
// import { EventEmitter } from 'stream';
//
@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrl: './child.component.css',
})
export class ChildComponent {
  name!: string;
  subscription: Subscription;
  constructor(childService: ChildService) {
    this.subscription = childService.name$.subscribe((response) => {
      this.name = response;
    });
  }
  @Input() childInput: string | undefined;

  @Output() nameEmitter = new EventEmitter<string>();

  displayName() {
    this.nameEmitter.emit('Yemisii');
  }
}
