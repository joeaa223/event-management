import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class OrganizerService {
    constructor(private http: HttpClient) {}

    registerOrganizer(organizerData: any) {
        return this.http.post<{message: string, organizer: any}>(
            'https://event-management-production-ec59.up.railway.app/api/register-organizer',
            organizerData
        );
    }
} 