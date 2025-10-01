import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorised',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterModule],
  templateUrl: './unauthorised.component.html',
  styleUrl: './unauthorised.component.scss'
})
export class UnauthorisedComponent {

}
