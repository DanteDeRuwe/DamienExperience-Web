import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSub: Partial<AuthenticationService>
  let routerSub: Partial<Router>
  let fbSub :Partial<FormBuilder>
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),RouterTestingModule
      ],
      declarations: [ LoginComponent ],
      providers: [ 
        { provide: AuthenticationService, useValue: authServiceSub },FormBuilder,
       ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    authServiceSub = TestBed.inject(AuthenticationService);
    routerSub = TestBed.inject(Router);
    fbSub = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods', () => {
    it('onSubmitLogin', () => {
      spyOn(authServiceSub, 'login');
      component.onSubmitLogin();
      expect(authServiceSub.login).toHaveBeenCalled();      
    });
  });
});
