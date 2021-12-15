const form = document.querySelector('form');
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const phoneNumber = document.querySelector('#phoneNumber');
const btnSubmit = document.querySelector('#btn-submit');
const table = document.querySelector('table');
const tableTbody = document.querySelector('table tbody');
const theme = document.getElementById('theme');

class Contact {
    constructor(firstName, _lastName, _phoneNumber) {
        this.firstName = firstName;
        this.lastName = _lastName;
        this.phoneNumber = _phoneNumber;
    }
}

class UI {
    static displayContacts() {
        const storedContacts = Store.getContacts();
        const contacts = storedContacts;
        contacts.forEach((contact) => UI.addContactToList(contact));
    }

    static addContactToList(contact) {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${contact.firstName}</td>
        <td>${contact.lastName}</td>
        <td>${contact.phoneNumber}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        tableTbody.appendChild(row); 
    }

    static removeContact(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        container.insertBefore(div, form);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2500);
    }

    static clearFields() {
        firstName.value = '';
        lastName.value = '';
        phoneNumber.value = '';
    }
}

class Store {
    static getContacts() {
        let contacts = null;
        if (localStorage.getItem('contacts') === null) {
            contacts = [];
        }
        else {
            contacts = JSON.parse(localStorage.getItem('contacts'));
        }
        return contacts;
    }

    static addContact(contact) {
        const contacts = Store.getContacts();
        contacts.push(contact);
        console.log('Adding to local storage');
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    static removeContact(phoneNumber) {
        const contacts = Store.getContacts();
        contacts.forEach((contact, index) => {
            if (contact.phoneNumber === phoneNumber) {
                contacts.splice(index, 1);
            }
        });
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}

// Event Display Contacts
document.addEventListener('DOMContentLoaded', UI.displayContacts);

// Event Add Contact
btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const contact = new Contact(firstName.value, lastName.value, phoneNumber.value);
    if (contact.firstName === '' || contact.lastName === '' || contact.phoneNumber === '') {
        UI.showAlert('Please fill all the fields', 'danger');
    }
    else {
        UI.addContactToList(contact);
        Store.addContact(contact);
        UI.showAlert('Added Contact', 'success');
        UI.clearFields();
    }
});

// Event Delete Contact
table.addEventListener('click', (e) => {
    UI.removeContact(e.target);
    Store.removeContact(e.target.parentElement.parentElement.children[2].textContent);
    UI.showAlert('Removed Contact', 'warning');
});