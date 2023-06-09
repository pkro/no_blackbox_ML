from sklearn.neighbors import KNeighborsClassifier

classes = {
    "car": 0,
    "fish": 1,
    "house": 2,
    "tree": 3,
    "bicycle": 4,
    "guitar": 5,
    "pencil": 6,
    "clock": 7
}


def readFeatureFile(filePath):
    with open(filePath, "r") as f:
        lines = f.readlines()
        X = []
        y = []

        for i in range(1, len(lines)):
            row = lines[i].split(",")
            X.append(
                [float(row[j]) for j in range(1, len(row) - 1)]
            )
            y.append(classes[row[-1].strip()])

        return X, y


X_train, y_train = readFeatureFile("../data/dataset/training.csv")
X_test, y_test = readFeatureFile("../data/dataset/testing.csv")

knn = KNeighborsClassifier(
    n_neighbors=50,
    algorithm="brute",
    weights="uniform"
)

knn.fit(X_train, y_train)

accuracy = knn.score(X_test, y_test)

print(accuracy)

# print(knn.predict(X_test))
