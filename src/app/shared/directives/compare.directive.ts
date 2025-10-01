import { NG_VALIDATORS, Validators, AbstractControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appCompareDirectives]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: CompareDirective,
    multi: true
  }]
})
export class CompareDirective implements Validators {
  // Syscraft comment
  // @Input() appCompareDirectives: string;
  @Input() appCompareDirectives!: string;
  validate(control: AbstractControl): { [key: string]: any } | null {
    // Syscraft comment
    // const controlToCompare = control.parent.get(this.appCompareDirectives);
    const controlToCompare = control.parent!.get(this.appCompareDirectives);
    if (controlToCompare && controlToCompare.value !== control.value) {
      return { 'notEqual': true };
    }

    return null;
  }

}
