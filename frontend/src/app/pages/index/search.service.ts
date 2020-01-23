import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import 'rxjs/Rx';
import { URLSearchParams } from "@angular/http";

@Injectable()
export class SearchService {
	constructor(private _http: Http) {}

	SEARCHACCOUNT = 'user/searchaccount/';
	MULESEARCHACCOUNT = 'account/search/';
	GETCONTRACT = 'user/getcontract/';
	GETCPCODE = 'user/getcpcode/';
	POST_REQUEST = 'app/submitrequest';
	public GET_REPORTING_GROUP = 'user/getreportinggroup/'
	public GET_GROUPS = 'user/groups/'
	public GET_USER = 'user/alluser/'
	public GET_USER_ROLES = 'user/allroles/'
	public POST_VISITOR= 'app/visitor/'
	public GET_STORAGE_GROUP = 'user/storagegroups/'
	public GET_UPLOAD_ACCOUNTS = 'user/uploadaccounts/'

	getResults(query) {
		// attaching params to url
		let params = new URLSearchParams();
		params.set('query', query); 
		params.set('API', this.SEARCHACCOUNT); 
		return this._http.get("api_searchaccount/", {search: params})
			.map(function (res) {
				if(res.status < 200 || res.status >= 300) {
					throw new Error('This request has failed ' + res.status);
				  }else if(res.status==500){
					  throw new Error("Please add OPEN API Credentails to Search")
				  } 
				  // If everything went fine, return the response
				  else {
					return res.json();
				  }
			});
	}
	getDetails(query) {
		let params = new URLSearchParams();
		params.set('account_switchKey', query);
		params.set('API', this.GETCONTRACT); 
		return this._http.get("api_getcontract/", {search: params})
			.map(function (res) {
				console.log(res.json());
				return res.json();
			});
	}

	getCpcode(query) {
		// attaching params to url
		let params = new URLSearchParams();
		params.set('account_switchKey', query);
		params.set('API', this.GETCPCODE); 
		return this._http.get("api_getcpcode/", {search: params})
			.map(function (res) {
				console.log(res.json());
				return res.json();
			});
	}
	
	getReportingGroup(query){
		let params = new URLSearchParams();
		params.set('account_switchKey', query);
		params.set('API', this.GET_REPORTING_GROUP);
		return this._http.get("api_getreportinggroup/", {search: params})
			.map(function (res) {
				return res.json();
			});

	}
	getGroups(query){
		let params = new URLSearchParams();
		params.set('account_switchKey', query); 
		params.set('API',this.GET_GROUPS);
		return this._http.get("api_groups/", {search: params})
			.map(function (res) {
				console.log(res.json());
				return res.json();
			});

	}
	getuserinformation(query){
		let params = new URLSearchParams();
		params.set('account_switchKey', query);
		params.set('API',this.GET_USER);
		return this._http.get("api_userinfo/", {search: params})
			.map(function (res) {
				console.log(res.json());
				return res.json();
			});
	}
	getuser_roles_information(query) {
		let params = new URLSearchParams();
		params.set('account_switchKey', query);
		params.set('API', this.GET_USER_ROLES);
		return this._http.get("api_userroles/", { search: params })
			.map(function (res) {
				console.log(res.json());
				return res.json();
			});
	}
	get_storage_groups(query) {
		let params = new URLSearchParams();
		params.set('account_switchKey', query);
		params.set('API', this.GET_STORAGE_GROUP);
		return this._http.get("api_storagegroup/", { search: params })
			.map(function (res) {
				console.log(res.json());
				return res.json();
			});
	}

	get_upload_accounts(query) {
		let params = new URLSearchParams();
		params.set('account_switchKey', query);
		params.set('API', this.GET_UPLOAD_ACCOUNTS);
		return this._http.get("api_uploadaccount/", { search: params })
			.map(function (res) {
				console.log(res.json());
				return res.json();
			});
	}
}