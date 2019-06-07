import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { shareReplay, map, switchMap } from 'rxjs/operators';

import {
	FieldWorkerType,
	EmployeeStatus,
	FieldTeam,
	FormType,
	FilledOutFormStatus,
	AdministratorDetails,
  LookupClient,
	CustomerClient,
	PersonnelClient
} from './api';
import { getAllListArgs } from './constants';

@Injectable({
	providedIn: 'root'
})
export class LookUpsService {

	private _refresh = new BehaviorSubject<void>(null);

	private _fieldWorkerTypes = this._refresh.pipe(
		switchMap(() => this.lookupsClient.getFieldWorkerTypes()),
		shareReplay(1)
	);

	private _employeeStatuses = this._refresh.pipe(
		switchMap(() => this.lookupsClient.getEmployeeStatuses()),
		shareReplay(1)
	);

	private _formTypes = this._refresh.pipe(
		switchMap(() => this.lookupsClient.getFormTypes()),
		shareReplay(1)
	);

	private _formStatuses = this._refresh.pipe(
		switchMap(() => this.lookupsClient.getFilledOutFormStatuses()),
		shareReplay(1),
	);

	private _railroadLogos = this._refresh.pipe(
		switchMap(() => this.customerClient.getRailroadLogos()),
		shareReplay(1)
	);

	private _adminDetails = this._refresh.pipe(
		switchMap(() => this.lookupsClient.getAdministratorDetails()),
		shareReplay(1)
	);

	constructor(
		private readonly lookupsClient: LookupClient,
		private readonly personnelClient: PersonnelClient,
		private readonly customerClient: CustomerClient
	) { }

	get fieldWorkerTypes(): Observable<FieldWorkerType[]> {
		return this._fieldWorkerTypes;
	}

	get employeeStatuses(): Observable<EmployeeStatus[]> {
		return this._employeeStatuses;
	}

	get formTypes(): Observable<FormType[]> {
		return this._formTypes;
	}

	get formStatuses(): Observable<FilledOutFormStatus[]> {
		return this._formStatuses;
	}

	get railroadLogos(): Observable<{[key: string]: string}> {
		return this._railroadLogos;
	}

	get adminDetails(): Observable<AdministratorDetails> {
		return this._adminDetails;
	}

  getFieldTeams = (): Observable<FieldTeam[]> => this.personnelClient.getTeams(getAllListArgs).pipe(
		map(pagedResults => pagedResults.results),
		shareReplay(1)
	)

	refreshLookups() {
		this._refresh.next(null);
	}
}
