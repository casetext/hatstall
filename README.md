hatstall
========

Hatstall is the time it takes the Sorting Hat to consider into which house someone should be sorted.

hatstall plugs into [sortinghat](https://github.com/casetext/sortinghat).  It takes events and shovels them into function invocation requests for various backends.  Comes with support for AWS Lambda and a pushing to a redis queue, which something like [locavore](https://github.com/casetext/locavore) can monitor.

Example
-------

    var invoker = hatstall('console');
    var sortinghat = new SortingHat(new Firebase(...));
    
    sortinghat.watch('/test/watch', invoker.run('test1'));
    
    sortinghat.trigger('/test/trigger', invoker.trigger('test2'));
    
    sortinghat.responder('/test/responder', invoker.responder('test3'));

API
---

### `hatstall(backend[, opts])`
Creates a new invoker using the specified backend.  `opts` are passed to the backend.  Hatstall comes with:

- `'redis'` - Puts invocation requests on a redis queue
- `'lambda'` - Invokes functions in AWS Lambda
- `'internal'` - Calls locavore directly.  Pass in a `Locavore` instance.
- `'console'` - Spits out the invocation requests on stdout.  Useful for debugging.

You get an invoker instance back from `hatstall()`.  It has:

### `invoke(fn, args[, cb])`
Issues a function invocation request with the supplied args.  If `cb` is specified, it will be called when the *request* is complete (not when the function is complete).  If the request fails, the first argument will contain the `err`.  (Your function may still fail to run or error.  This callback only tells you that the request for invocation succeeded or failed.)

`invoke` also returns a promise for your convenience.

### `run(fn, deleteAfter)`
Returns a function that when called will call `invoke(fn, { path, key, data })`.  `path`, `key`, and `data` are populated from the Firebase `Snapshot` passed in.

If `deleteAfter` is `true`, the object will be deleted from Firebase upon a successful invocation request.

### `trigger(fn)`
Calls `run(fn, true)`.

### `responder(fn)`
For use with [responders](https://github.com/casetext/sortinghat#responderpath-options-cb).

### `job(fn[, args])`
Returns a function that when called will call `invoke(fn, args)`.  Useful for invoking scheduled tasks that take the same arguments every time.