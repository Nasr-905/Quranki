use strict;
use warnings;
use JSON;
use File::Path qw(make_path);
use File::Copy;

# You also need to have ffmpeg installed

my $alfasy_file = "Alafasy_128kbps.json";
my $segments_file = "segments(cor).json";
my $verse_by_verse_dir = "000_versebyverse";
my $segmented_dir = "segmented";

# Load JSON data
open my $alfasy_fh, '<', $alfasy_file or die "Could not open $alfasy_file: $!";
my $alfasy_json = do { local $/; <$alfasy_fh> };
close $alfasy_fh;
my $alfasy = decode_json($alfasy_json);

open my $seg_fh, '<', $segments_file or die "Could not open $segments_file: $!";
my $seg_json = do { local $/; <$seg_fh> };
close $seg_fh;
my $seg = decode_json($seg_json);

# Iterate through each data in alfasy
for my $x (@$alfasy) {
    my $aya = $x->{"ayah"} - 1;
    my $sura = $x->{"surah"} - 1;
    my $fSura = sprintf("%03d", $sura+1);
    my $fAya = sprintf("%03d", $aya+1);
    my $rec_file = "$verse_by_verse_dir/$fSura$fAya.mp3";
    
    # Check if file exists
    next unless (-e $rec_file);
    
    # Load audio segment
    my $start;
    my $end;
    my $rec = Audio::FindChunks->new($rec_file);
    for my $y (@{$seg->{$sura}[$aya]}) {
        my $segment = sprintf("%02d", $seg->{$sura}[$aya]->index($y)+1);
        $start = $x->{"segments"}[$y->[0]][2];
        $end = $x->{"segments"}[$y->[1]-1][3];
        my $segment_file = "$segmented_dir/$fSura$fAya$segment.mp3";
        
        # Export segmented audio
        my $audio = $rec->clip($start, $end);
        make_path($segmented_dir);
        $audio->export($segment_file, "mp3");
    }
}

# Helper module to find audio chunks
package Audio::FindChunks;

use strict;
use warnings;
use base qw(Exporter);
use MP3::Splitter;

sub new {
    my ($class, $file) = @_;
    my $self = {};
    $self->{file} = $file;
    $self->{splitter} = MP3::Splitter->new();
    $self->{splitter}->load($file);
    bless $self, $class;
    return $self;
}

sub clip {
    my ($self, $start, $end) = @_;
    my $clip = $self->{splitter}->split({ seclist => [[$start, $end]] });
    return $clip;
}

1;
