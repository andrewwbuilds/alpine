import { haveText, html, test } from '../../utils'

test('can expose data for x-model binding',
    html`
        <div x-data="{ outer: 'foo' }">
            <div x-data="{ inner: 'bar' }" x-modelable="inner" x-model="outer">
                <h1 x-text="outer"></h1>
                <h2 x-text="inner"></h2>

                <button @click="inner = 'bob'" id="1">change inner</button>
                <button @click="outer = 'lob'" id="2">change outer</button>
            </div>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('foo'))
        get('h2').should(haveText('foo'))
        get('#1').click()
        get('h1').should(haveText('bob'))
        get('h2').should(haveText('bob'))
        get('#2').click()
        get('h1').should(haveText('lob'))
        get('h2').should(haveText('lob'))
    }
)

test('x-modelable works when inside x-bind and x-model is outside',
    html`
        <div x-data="{ outer: 'foo', thing: {
            ['x-modelable']: 'inner',
        } }">
            <div x-data="{ inner: 'bar' }" x-bind="thing" x-model="outer">
                <h1 x-text="outer"></h1>
                <h2 x-text="inner"></h2>

                <button @click="inner = 'bob'" id="1">change inner</button>
                <button @click="outer = 'lob'" id="2">change outer</button>
            </div>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('foo'))
        get('h2').should(haveText('foo'))
        get('#1').click()
        get('h1').should(haveText('bob'))
        get('h2').should(haveText('bob'))
        get('#2').click()
        get('h1').should(haveText('lob'))
        get('h2').should(haveText('lob'))
    }
)

test('x-modelable removes the event listener used by corresponding x-model',
    html`
        <div x-data="{ outer: 'foo' }">
            <div x-data="{ inner: 'bar' }" x-modelable="inner" x-model="outer">
                <h1 x-text="outer"></h1>
                <h2 x-text="inner"></h2>
                <button id="1" @click="$dispatch('input', 'baz')"></button>
            </div>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('foo'))
        get('h2').should(haveText('foo'))
        get('#1').click()
        get('h1').should(haveText('foo'))
        get('h2').should(haveText('foo'))
    }
)

test('x-modelable works with .debounce modifier',
    html`
        <div x-data="{ outer: 'foo' }">
            <div x-data="{ inner: 'bar' }" x-modelable="inner" x-model.debounce="outer">
                <h1 x-text="outer"></h1>
                <h2 x-text="inner"></h2>

                <button @click="inner = 'bob'" id="1">change inner</button>
                <button @click="inner = 'lob'" id="2">change inner</button>
            </div>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('foo'))
        get('h2').should(haveText('foo'))
        get('#1').click()
        get('h1').should(haveText('bob'))
        get('h2').should(haveText('bob'))
        get('#2').click()
        get('h1').should(haveText('bob'))
        get('h2').should(haveText('lob'))
    }
)

test('x-modelable works with .throttle modifier',
    html`
        <div x-data="{ outer: 'foo' }">
            <div x-data="{ inner: 'bar' }" x-modelable="inner" x-model.throttle="outer">
                <h1 x-text="outer"></h1>
                <h2 x-text="inner"></h2>

                <button @click="inner = 'bob'" id="1">change inner</button>
                <button @click="inner = 'lob'" id="2">change inner</button>
            </div>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('foo'))
        get('h2').should(haveText('foo'))
        get('#1').click()
        get('h1').should(haveText('bob'))
        get('h2').should(haveText('bob'))
        get('#2').click()
        get('h1').should(haveText('bob'))
        get('h2').should(haveText('lob'))
    }
)

test('works when inside x-teleport',
    html`
        <div x-data="{ outer: 'foo' }">
            <template x-teleport="body">
                <div x-data="{ inner: 'bar' }" x-modelable="inner" x-model="outer">
                    <h1 x-text="outer"></h1>
                    <h2 x-text="inner"></h2>

                    <button @click="inner = 'bob'" id="1">change inner</button>
                    <button @click="outer = 'lob'" id="2">change outer</button>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('foo'))
        get('h2').should(haveText('foo'))
        get('#1').click()
        get('h1').should(haveText('bob'))
        get('h2').should(haveText('bob'))
        get('#2').click()
        get('h1').should(haveText('lob'))
        get('h2').should(haveText('lob'))
    }
)

test('works when inside x-teleport when targeting parent',
    html`
        <div x-data="{ value: 'foo' }">
            <h2 x-text="value"></h2>

            <template x-teleport="body">
                <div x-data="{ value: 'bar' }" x-modelable="value" x-model.parent="value">
                    <h1 x-text="value"></h1>

                    <button @click="value = 'bob'" id="1">change to bob</button>
                    <button @click="value = 'lob'" id="2">change to lob</button>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('foo'))
        get('h2').should(haveText('foo'))
        get('#1').click()
        get('h1').should(haveText('bob'))
        get('h2').should(haveText('bob'))
        get('#2').click()
        get('h1').should(haveText('lob'))
        get('h2').should(haveText('lob'))
    }
)

test('works when inside x-teleport with x-data directly on it',
    html`
        <div>
            <template x-teleport="body" x-data="{ value: 'foo' }">
                <div x-data="{ value: 'bar' }" x-modelable="value" x-model.parent="value">
                    <h1 x-text="value"></h1>

                    <button @click="value = 'bob'" id="1">change to bob</button>
                    <button @click="value = 'lob'" id="2">change to lob</button>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('foo'))
        get('#1').click()
        get('h1').should(haveText('bob'))
        get('#2').click()
        get('h1').should(haveText('lob'))
    }
)

test('x-modelable does not resync for a change made after its element is removed',
    html`
        <div x-data="{ outer: 'foo' }">
            <div x-data="{ inner: 'bar' }" x-modelable="inner" x-model="outer">
                <button x-on:click="$root.remove(); inner = 'baz'"></button>
            </div>

            <h1 x-text="outer"></h1>
        </div>
    `,
    ({ get }) => {
        get('button').click()
        get('h1').should(haveText('foo'))
    }
)

test('x-modelable keeps a change made right after a morph',
    html`
        <div x-data="{ outer: 'foo' }">
            <div x-data="{ inner: 'bar' }" x-modelable="inner" x-model="outer">
                <button x-on:click="Alpine.morph($root, $root.outerHTML); inner = 'baz'"></button>
            </div>

            <h1 x-text="outer"></h1>
        </div>
    `,
    ({ get }) => {
        get('button').click()
        get('h1').should(haveText('baz'))
    }
)

test('x-modelable does not leave a binding behind after a morph',
    html`
        <div x-data="{ outer: 'foo' }">
            <div x-data="{ inner: 'bar' }" x-modelable="inner" x-model="outer">
                <button id="1" x-on:click="Alpine.morph($root, $root.outerHTML)"></button>
                <button id="2" x-on:click="$root.remove(); inner = 'baz'"></button>
            </div>

            <h1 x-text="outer"></h1>
        </div>
    `,
    ({ get }) => {
        get('#1').click()
        get('#2').click()
        get('h1').should(haveText('foo'))
    }
)
