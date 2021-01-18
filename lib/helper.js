/**
 * @file helpers
 * @author Dafrok
 */

export function shuffle(source) {
    const ary = [...source];
    let times = ary.length
    while (times) {
        ary.push(ary.splice(0 | Math.random() * times, 1)[0])
        times--
    }
    return ary
}