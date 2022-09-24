var Tokens = {text: 1, quote: 2, comma: 3};

function lexer(txt) {
    const Regexes = [
        {regex: /"/, token: Tokens.quote},
        {regex: /,/, token: Tokens.comma},
    ];

    function tokenize(char) {
        let match = Regexes.find(r => r.regex.test(char))
        return match && match.token || Tokens.text
    }

    function scan(pos, chars, stopfn) {
        let value = '';
        while(pos < chars.length && !stopfn(tokenize(chars[pos]))) {
            value += chars[pos++]
        }
        return {value, pos}
    }

    let lexemes = []
    let i = 0
    while(i < txt.length) {
        let token = tokenize(txt[i])
        if(token === Tokens.quote) {
            let {value, pos} = scan(i+1, txt, t => t === Tokens.quote)
            i = pos + 1
            lexemes = lexemes.concat({token, value: '"'+value+'"'})
        } else if(token === Tokens.comma) {
            i++
            lexemes = lexemes.concat({token, value:','})
        } else {
            let {value, pos} = scan(i, txt, t => t === Tokens.comma || t === Tokens.quote)
            i = pos
            lexemes = lexemes.concat({token, value})
        }
    }
    return lexemes;
}

function pre(txt) {
    return lexer(txt).reduce((p, c) => {
        if (c.token === Tokens.comma) {
            return p + " "
        }
        return p + c.value
    }, "");
}