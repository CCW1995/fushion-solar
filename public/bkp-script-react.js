const WHAT_IS_YOUR_SUSPICION = {
  'en': 'What is your suspicion?*',
  'de': 'Worauf bezieht sich Ihr Verdacht?*'
}
const IN_WHICH_COMPANY_THIS_TAKE_PLACE = {
  'en': 'In which company did the incident take place?',
  'de': 'Sind Sie Mitarbeiter(in) des betroffenen Unternehmensbereiches?'
}
const ASK_FOR_AFFECTED_DEPARTMENT = {
  'en': 'Please give the name of the affected department',
  'de': 'Bitte geben Sie den Namen der betroffenen Abteilung an'
}
const ASK_FOR_PEOPLE_INVOLVED = {
  'en': 'Who is involved in the incident?',
  'de': 'Wer ist an dem Vorfall beteiligt?'
}
const ASK_FOR_COUNTRY = {
  'en': 'In which country did the incident take place?',
  'de': 'In welchem Land hat sich der Vorfall ereignet?'
}
const ASK_FOR_CITY = {
  'en': 'In which city did the incident occur?',
  'de': 'In welcher Stadt hat sich der Vorfall ereignet?'
}
const IS_ANONYMOUS = {
  'en': 'Stay anonymous',
  'de': 'Anonym bleiben'
}
const CONTACT_INFO = {
  'en': 'Contact information',
  'de': 'Kontaktinformationen'
}
const EMAIL = {
  'en': 'Email',
  'de': 'E-Mail'
}
const NAME = {
  'en': 'Name',
  'de': 'Name'
}
const CONTACT = {
  'en': 'Contact',
  'de': 'Kontakt'
}
const SECURE_INBOX = {
  'en': 'Secure inbox',
  'de': 'Passwort'
}
const PASSWORD = {
  'en': 'Password',
  'de': 'Passwort'
}
const REPEAT_PASSWORD = {
  'en': 'Repeat Password',
  'de': 'Passwort wiederholen'
}
const SUBMIT = {
  'en': 'Submit',
  'de': 'Senden'
}
const SUBMITTED_SUCCESSFULLY = {
  'en': 'Submitted successfully',
  'de': 'Erfolgreich abgeschickt'
}
const MISSING_INFORMATION = {
  'en': 'Some information is missing.',
  'de': 'Es fehlen einige Informationen.'
}
const CLOSE = {
  'en': 'Close',
  'de': 'Schließen Sie'
}

window.addEventListener( 'DOMContentLoaded', function( evt ) {
  let selectedLanguage = document.querySelector( '#bkp-plugin' ).dataset.locale.split('-')[0]
  let style = document.createElement( 'style' )
  let css = `
    .bkp-form {
      font-family: 'Open Sans';
    }
  `
  style.innerHTML = css
  let HTMLString = `
  <div className="container pb-3">
    <div className="row">
      <div className="col-md-7">
        <div className="bkp-form">
          <h1>Form Here</h1>
          <div id="notification"></div>
          <div className="form-group pb-3">
            <label>${ WHAT_IS_YOUR_SUSPICION[ selectedLanguage ] }</label>
            <textarea className="form-control" id="bkp-case-desc" rows="3" required></textarea>
          </div>
          <div className="form-group pb-3">
            <label>${ IN_WHICH_COMPANY_THIS_TAKE_PLACE[ selectedLanguage ] }</label>
            <input id="bkp-company" className="form-control" type="text" />
          </div>
          <div className="form-group pb-3">
            <label>${ ASK_FOR_AFFECTED_DEPARTMENT[ selectedLanguage ] }:</label>
            <input id="bkp-company-department" className="form-control" type="text" />
          </div>
          <div className="form-group pb-3">
            <label>${ ASK_FOR_PEOPLE_INVOLVED[ selectedLanguage ] }</label>
            <input id="bkp-company-department-person" className="form-control" type="text" />
          </div>
          <div className="form-group pb-3">
            <label>${ ASK_FOR_COUNTRY[ selectedLanguage ] }</label>
            <input id="bkp-country" className="form-control" type="text" />
          </div>
          <div className="form-group pb-3">
            <label>${ ASK_FOR_CITY[ selectedLanguage ] }</label>
            <input id="bkp-city" className="form-control" type="text" />
          </div>
          <div className="form-group pb-3">
            <input id="bkp-is-anonymous" type="checkbox" /> ${ IS_ANONYMOUS[ selectedLanguage ] } 
          </div>
          <div id="bkp-form-not-anonymous">
            <h4>${ CONTACT_INFO[ selectedLanguage ] }</h4>
            <div className="form-group pb-3">
              <label>${ EMAIL[ selectedLanguage ] }</label>
              <input id="bkp-email" className="form-control" type="email" />
            </div>
            <div className="form-group pb-3">
              <label>${ NAME[ selectedLanguage ] }</label>
              <input id="bkp-name" className="form-control" type="text" />
            </div>
            <div className="form-group pb-3">
              <label>${ CONTACT[ selectedLanguage ] }</label>
              <input id="bkp-contact" className="form-control" type="text" />
            </div>
          </div>
          <div className="">
            <h4>${ SECURE_INBOX[ selectedLanguage ] }</h4>
            <div className="form-group pb-3">
              <label>${ PASSWORD[ selectedLanguage ] }</label>
              <input id="bkp-password" className="form-control" type="password" />
            </div>
            <div className="form-group pb-3">
              <label>${ REPEAT_PASSWORD[ selectedLanguage ] }</label>
              <input id="bkp-password-repeat" className="form-control" type="password" />
            </div>
          </div>
          <button id="bkp-form-submit-button" className="btn btn-primary mt-3">
            ${ SUBMIT[ selectedLanguage ] }
          </button>
        </div>
        <div id="bkp-form-submit-status">
          ${ SUBMITTED_SUCCESSFULLY[ selectedLanguage ] }
        </div>
      </div>
      <div className="col-md-5 bkp-form">
        <div className="card card-body">
          <h4>Lorem Ipsum</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </div>
    </div>
    <div className="modal fade" id="bkp-form-check-failed-modal" tabindex="-1" role="dialog" aria-labelledby="checkFailedModal" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"></h5>
            <button type="button" className="btn btn-close-modal" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            ${ MISSING_INFORMATION[ selectedLanguage ] }
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-close-modal" data-dismiss="modal">${ CLOSE[ selectedLanguage ] }</button>
          </div>
        </div>
      </div>
    </div>
    <div id="bg-loader-bkp">
      <div className="loader"></div>
    </div>
    <style>
    #bg-loader-bkp {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      align-items: center;
      justify-content: center;
    }
    #bkp-form-submit-status {
      display: none;
    }
    .loader {
      border: 16px solid #f3f3f3; /* Light grey */
      border-top: 16px solid #3498db; /* Blue */
      border-radius: 50%;
      width: 120px;
      height: 120px;
      animation: spin 2s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    </style>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet"/>
  </div>
  `
  document.querySelector( '#bkp-plugin' ).innerHTML = HTMLString
  document.querySelector( '#bkp-plugin' ).appendChild( style )
  let scriptElement = document.createElement( 'script' )
  scriptElement.setAttribute( 'src', 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js' )
  document.head.appendChild( scriptElement )

  document.querySelector( '#bkp-is-anonymous' ).addEventListener( 'click', function( e ) {
    if( e.target.checked ) {
      document.querySelector( '#bkp-form-not-anonymous' ).style.display = 'none'
    } else {
      document.querySelector( '#bkp-form-not-anonymous' ).style.display = 'block'
    } 
  })
  document.querySelector( '#bkp-form-submit-button' ).addEventListener( 'click', function( e ) {
    let token = document.querySelector( '#bkp-plugin' ).dataset.accessToken
    const ENCRYPTION_KEY = 'sowbellY83seated72sTitch'
    let description = document.querySelector( '#bkp-case-desc' ).value
    let company = document.querySelector( '#bkp-company' ).value
    let company_department = document.querySelector( '#bkp-company-department' ).value
    let company_department_person = document.querySelector( '#bkp-company-department-person' ).value
    let country = document.querySelector( '#bkp-country' ).value
    let city = document.querySelector( '#bkp-city' ).value
    let is_anonymous = document.querySelector( '#bkp-is-anonymous' ).checked
    let email = document.querySelector( '#bkp-email' ).value
    let name = document.querySelector( '#bkp-name' ).value
    let contact = document.querySelector( '#bkp-contact' ).value
    let password = document.querySelector( '#bkp-password' ).value
    let password_repeat = document.querySelector( '#bkp-password-repeat' ).value
    let send_check = true
    if( description === '' ) {
      send_check = false
      document.querySelector( '#bkp-case-desc' ).classList.add( 'border', 'border-danger' )
    } else {
      send_check = true
      document.querySelector( '#bkp-case-desc' ).classList.remove( 'border', 'border-danger' )
    }
    if( password === '' ) {
      send_check = false
      document.querySelector( '#bkp-password' ).classList.add( 'border', 'border-danger' )
    } else {
      send_check = true
      document.querySelector( '#bkp-case-desc' ).classList.remove( 'border', 'border-danger' )
    }
    if( password_repeat === '' ) {
      send_check = false
      document.querySelector( '#bkp-password-repeat' ).classList.add( 'border', 'border-danger' )
    } else {
      send_check = true
      document.querySelector( '#bkp-case-desc' ).classList.remove( 'border', 'border-danger' )
    }
    if( !is_anonymous ) {
      if( email === '' ) {
        send_check = false
        document.querySelector( '#bkp-email' ).classList.add( 'border', 'border-danger' )
      } else {
        send_check = true
        document.querySelector( '#bkp-email' ).classList.remove( 'border', 'border-danger' )
      }
      if( name === '' ) {
        send_check = false
        document.querySelector( '#bkp-name' ).classList.add( 'border', 'border-danger' )
      } else {
        send_check = true
        document.querySelector( '#bkp-name' ).classList.remove( 'border', 'border-danger' )
      }
      if( contact === '' ) {
        send_check = false
        document.querySelector( '#bkp-contact' ).classList.add( 'border', 'border-danger' )
      } else {
        send_check = true
        document.querySelector( '#bkp-contact' ).classList.remove( 'border', 'border-danger' )
      }
    }
    if( send_check ) {
      let data = {
        description: description,
        company: company,
        company_department: company_department,
        company_department_person: company_department_person,
        country: country,
        city: city,
        is_anonymous: is_anonymous,
        email: email,
        name: name,
        contact: contact,
        password: password,
        password_repeat: password_repeat
      }
      let encryptedData = CryptoJS.AES.encrypt( JSON.stringify(data), ENCRYPTION_KEY).toString()
      let encryptedRoute = CryptoJS.AES.encrypt( JSON.stringify( 'api/v1/form-submit' ), ENCRYPTION_KEY).toString()

      document.querySelector( '#bg-loader-bkp' ).style.display = 'flex'
      fetch( `https://whistleblower-center-api.proof-point.com/${ encryptedRoute }`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        referrer: 'no-referrer',
        body: encryptedData
      }).then( ( response ) => {
        document.querySelector( '#bg-loader-bkp' ).style.display = 'none'
        if ( response.ok ) {
          document.querySelector( '#bkp-form-submit-status' ).style.display = 'block'
          document.querySelector( '.bkp-form' ).style.display = 'none'
        }
      }).catch( err => {
        document.querySelector( '#bg-loader-bkp' ).style.display = 'none'
      })
    } else {
      let modal = document.querySelector( '#bkp-form-check-failed-modal' ) 
      let closeModalButtons = document.querySelectorAll( '#bkp-form-check-failed-modal .btn-close-modal' )

      modal.style.display = "block";
      modal.className="modal fade show"; 

      for ( let i = 0 ; i < closeModalButtons.length; i++ ) {
        closeModalButtons[i].addEventListener('click', (e) => {
          modal.style.display = "none"
          modal.className="modal fade"
          for ( let i = 0 ; i < closeModalButtons.length; i++ ) {
            closeModalButtons[i].removeEventListener( 'click', ()=>{} )
          }
        })
      } 
    }
  })
})