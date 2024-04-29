import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(inputDate: Date | string): string {
    const today = new Date();
    const dateObj = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()) {
      return `Today, ${new DatePipe('en-UK').transform(dateObj, 'HH:mm')!}`;
    }

    else if (dateObj.getDate() === yesterday.getDate() &&
      dateObj.getMonth() === yesterday.getMonth() &&
      dateObj.getFullYear() === yesterday.getFullYear()) {
      return `Yesterday, ${new DatePipe('en-UK').transform(dateObj, 'HH:mm')!}`;
    }

    else {
      return new DatePipe('en-UK').transform(dateObj, 'dd MMM yyyy')!;
    }
  }
}
