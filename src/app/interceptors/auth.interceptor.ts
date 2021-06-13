import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    let cloned: HttpRequest<any>;
    if (token && !this.auth.isTokenExpired()) {
      // If we have a valid JWT Token we send it
      cloned = req.clone({
        headers: req.headers
          .set('Authorization', 'Bearer ' + token)
          .set('cache-control', 'no-cache')
          .set('Content-Type', 'application/json')
      });
    } else if (this.auth.isTokenExpired()) {
      // If the token is expired we block the request and navigate to the login page
      this.auth.logout();
      this.router.navigate(['/login']);
      return EMPTY;
    } else {
      // If the token is missing we send the request without it
      cloned = req.clone({
        headers: req.headers
          .set('cache-control', 'no-cache')
          .set('Content-Type', 'application/json')
      });
    }
    return next.handle(cloned);
  }
}
