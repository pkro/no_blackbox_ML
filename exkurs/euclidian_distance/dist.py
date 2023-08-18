def euclidean_distance(p1, p2):
    if len(p1) != len(p2):
        raise ValueError("Incompatible points")
    sq_dist = 0
    for dim in range(len(p1)):
        sq_dist += (p2[dim] - p1[dim]) ** 2

    return sq_dist ** 0.5 # sqrt(sq_dist)
