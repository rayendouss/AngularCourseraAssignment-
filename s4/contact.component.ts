import { Component, OnInit , ViewChild} from '@angular/core';
import {FormBuilder, FormGroup , Validators} from '@angular/forms';
import {Feedback, ContactType} from '../shared/feedback';
import {expand, flyInOut} from '../animations/app.animations';
import {FeedbackService} from '../services/feedback.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut()
    , expand()
  ]
})
export class ContactComponent implements OnInit {
  @ViewChild('fform') feedbackFormDirective;
  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackCopy: Feedback;
  contactType = ContactType;
  errMess: string;
  submited: Boolean;
  waiting: Boolean;
  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
     'email': ''
  };
  validationMessages = {
    'firstname': {
      'required': 'First name is required',
      'minlength': 'First name must be at least two characters long',
      'maxlength': 'First name cannot be more than 25 characters'
    },
    'lastname': {
      'required': 'Last name is required',
      'minlength': 'Last name must be at least two characters long',
      'maxlength': 'Last name cannot be more than 25 characters'
    },
    'telnum': {
      'required' : 'Tel. number is required',
      'pattern' : 'Tel. number must contain only numbers'
    },
    'email': {
      'required' : 'email is required',
      'email' : 'email not in valid format.'
    }
  };
  constructor(private fb: FormBuilder,
  private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', Validators.required, Validators.pattern ],
      email: ['', Validators.required , Validators.email],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  this.onValueChanged();
  }
  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ' ;
            }
          }
        }

      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.submited = true;
    this.waiting = true;
    this.feedbackCopy = this.feedbackForm.value;
    this.feedbackService.submitFeedback(this.feedbackCopy)
      .subscribe(feed => {
        this.feedback = feed;
        this.feedbackCopy = feed;
        this.waiting = false;
          setTimeout(() => {
            this.submited = false;
          }, 5000);
      },
        errmess => { this.feedback = null; this.feedbackCopy = null; this.errMess = <any>errmess; });
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }


}
