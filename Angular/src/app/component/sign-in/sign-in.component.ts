import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  user: User = { login: '', password: '' };
  error: boolean = false;
  sigInSuccess: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  submit(): void {
    this.userService.signIn(this.user).subscribe({
      next: () => {
        this.sigInSuccess = true;
        this.error = false;
        setTimeout(() => {
          this.router.navigate([''])
        }, 2000);
      },
      error: () => {
        this.error = true;
        this.sigInSuccess = false;
      }
    });
  }
}
