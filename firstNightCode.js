fib(target) {
  current, i, temp = 1
  last = 0
  while i < target { 
    temp = current + last;
    last = current;
    current = temp;    
    i++;
  }
  return current;
}
Big O = n 

