import { Observable, of } from 'rxjs';
import { getAllListArgs } from './constants';

// Minimal objects for demonstaration purposes
export class CustomerClient {
  getRailroadLogos(): Observable<{[key: string]: string}> {
    return of({ 'railroadOne': 'logo' });
  }
};

export class LookupClient {
  getFieldWorkerTypes(): Observable<FieldWorkerType[]> {
    return of(new Array<FieldWorkerType>());
  }
  getEmployeeStatuses(): Observable<EmployeeStatus[]> {
    return of(new Array<EmployeeStatus>());
  }
  getFormTypes(): Observable<FormType[]> {
    return of(new Array<FormType>());
  }
  getFilledOutFormStatuses(): Observable<FilledOutFormStatus[]> {
    return of(new Array<FilledOutFormStatus>());
  }
  getAdministratorDetails(): Observable<AdministratorDetails> {
    return of({});
  }
};

export class PersonnelClient {
  getTeams(param: FieldTeamListArgs): Observable<PagedResultsOfFieldTeam> {
    return of()
  }
};

export interface ListArgs {
    searchText?: string | undefined;
    sortCriteria?: SortCriterion[] | undefined;
    pageSize?: number | undefined;
    pageNumber?: number | undefined;
}

export interface SortCriterion {
    sortKey?: string | undefined;
    isDescending?: boolean | undefined;
}

export interface PagedResultsOfFieldTeam {
    resultCount?: number | undefined;
    pageNumber?: number | undefined;
    results?: FieldTeam[] | undefined;
}

export interface FieldTeamListArgs {
    railroadId?: number | undefined;
    searchText?: string | undefined;
    sortCriteria?: SortCriterion[] | undefined;
    pageSize?: number | undefined;
    pageNumber?: number | undefined;
}

export interface FieldWorkerType {
  id: number;
  description: string;
};
export interface EmployeeStatus {};
export interface FieldTeam {};
export interface FormType {};
export interface FilledOutFormStatus {};
export interface AdministratorDetails {};