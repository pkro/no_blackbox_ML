function euclidianDistance(p1, p2) {
    if(p1.length !== p2.length) {
        throw new Error("Incompatible point dimensions")
    }

    let sqDist = 0;

    for(let dim = 0; dim<p1.length; dim++) {
        sqDist += (p1[dim] - p2[dim]) ** 2;
    }

    return sqDist ** 0.5; // square root
}