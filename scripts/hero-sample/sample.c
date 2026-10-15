/* A short routine written for this portfolio, compiled to produce a real disassembly. */
int verify(const unsigned char *buf, int len) {
    unsigned h = 5381;
    for (int i = 0; i < len; i++)
        h = h * 33 ^ buf[i];
    return h == 0xC0FFEEu;
}
int main(int argc, char **argv) { return verify((const unsigned char *)argv[0], argc); }
