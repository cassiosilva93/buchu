class Ok {

	constructor(value) {
		this.value = value
		if (value instanceof Ok)
			this.value = value.value
	}

	get isOk() { return true }
	get isErr() { return false }
	get ok() { return this.value }
	get err() { return null }
	
	toString() {
		if (this.value)
			return 'Ok: ' + JSON.stringify(this.value)
		return 'Ok'
	}

	toJSON() { return { 'Ok': (this.value === undefined ? '' : this.value) } }
}

class Err {

	constructor(error) {
		this._error = error
		if (error instanceof Err)
			this._error = error._error
	}

	get isOk() { return false }
	get isErr() { return true }
	get ok() { return null }
	get err() { return this._error }

	toString() {
		if (this._error)
			return "Error: " + JSON.stringify(this._error)
		return "Error"
	}

	toJSON() {
		let error = (this._error === undefined ? '' : this._error)
		error = error instanceof Error ? error.toString() : error
		return { 'Error': error }
	}

	static _notFound ({ message = 'Not Found', payload, cause } = {}){ 
		return Err._buildCustomErr('NOT_FOUND', message, payload, cause, 'NotFound', 'notFound')
	}
	
	static _alreadyExists ({ message = 'Already exists', payload, cause } = {}) { 
		return Err._buildCustomErr('ALREADY_EXISTS', message, payload, cause, 'AlreadyExists')
	}
	
	static _invalidEntity ({ message = 'Invalid entity', payload, cause } = {}) { 
		return Err._buildCustomErr('INVALID_ENTITY', message, payload, cause, 'InvalidEntity')
	}
	
	static _invalidArguments ({ message = 'Invalid arguments', args, payload = {}, cause } = {}) { 
		payload.invalidArgs = args
		return Err._buildCustomErr('INVALID_ARGUMENTS', message, payload, cause, 'InvalidArguments')
	}
	
	static _permissionDenied ({ message = 'Permission denied', payload, cause } = {}) { 
		return Err._buildCustomErr('PERMISSION_DENIED', message, payload, cause, 'PermissionDenied')
	}
	
	static _unknown ({ message = 'Unknown Error', payload, cause } = {}) { 
		return Err._buildCustomErr('UNKNOWN', message, payload, cause, 'Unknown')
	}

	static _buildCustomErr(code, message, payload, cause, caller) {
		const err = new Err({ payload, cause, code, message })
		err[`is${caller}Error`] = true
		return err
	}
}

const _exports = {
	Ok: (value) => new Ok(value),
	Err: (err) => new Err(err),
}

_exports.Err.notFound = Err._notFound
_exports.Err.alreadyExists = Err._alreadyExists
_exports.Err.invalidEntity  = Err._invalidEntity
_exports.Err.invalidArguments = Err._invalidArguments
_exports.Err.permissionDenied= Err._permissionDenied
_exports.Err.unknown = Err._unknown
_exports.Err.buildCustomErr = Err._buildCustomErr

module.exports = _exports