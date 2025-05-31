import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class OrganizerService {
    constructor(private http: HttpClient) {}

    registerOrganizer(organizerData: any) {
        return this.http.post<{message: string, organizer: any}>(
            'http://localhost:3001/api/register-organizer',
            organizerData
        );
    }
} 