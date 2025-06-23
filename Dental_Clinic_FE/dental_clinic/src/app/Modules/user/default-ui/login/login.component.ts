import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { SnackBarService } from '../../../../core/services/snack-bar.service';
import { AuthService } from '../../../../core/services/auth.service';
// import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  // Assuming this component is part of a module that imports FormsModule
  // If it were standalone: true, you'd add imports: [FormsModule, CommonModule] here
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Corrected styleUrl to styleUrls
})
export class LoginComponent implements OnInit { // Implement OnInit if needed, otherwise remove

  // Properties to bind to the form inputs
  loginData = {
    userId: '',
    password: ''
  };

  isLoading = false; // To show loading state on the button
  errorMessage: string | null = null; // To display login errors

  constructor(
    private snackbarService: SnackBarService,
    private authService: AuthService,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    // Optional: Check if already logged in, redirect if necessary
    // This might be better handled by a route guard
    // if (this.authService.getAuthStatus()) {
    //   // Determine where to redirect based on role?
    //   // Example: this.router.navigate(['/dashboard']);
    // }
  }

  onSubmit(): void {
    if (!this.loginData.userId || !this.loginData.password) {
      this.errorMessage = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
      return; // Prevent submission if fields are empty
    }

    this.isLoading = true;
    this.errorMessage = null; // Clear previous errors
    this.authService.login(this.loginData.userId, this.loginData.password)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          // Navigate to a protected route after successful login
          // You might want to navigate based on the role stored by AuthService
          // For example, check this.authService.getAdminStatus(), etc.
          this.router.navigate(["/" + this.authService.getUserRole().toLowerCase()])
        },
        error: (err) => {
          this.isLoading = false;
          this.snackbarService.notifyError(err.error.message)
        },
        // 'complete' is usually not needed here as next/error covers most cases
        // complete: () => {
        //   this.isLoading = false; // Ensure loading is stopped
        // }
      });
  }
}