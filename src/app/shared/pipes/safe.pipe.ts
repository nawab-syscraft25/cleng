import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
    standalone: true,
    name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
    constructor(private readonly sanitizer: DomSanitizer) { }

    public transform(file: any): SafeResourceUrl {
        let url = URL.createObjectURL(file);
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}